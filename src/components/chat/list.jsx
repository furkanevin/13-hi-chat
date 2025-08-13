import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { auth, db } from "../../firebase";
import Message from "./message";
import Arrow from "./arrow";

const List = ({ room }) => {
  const [messages, setMessages] = useState([]);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const lastMessageRef = useRef();
  const audioRef = useRef(new Audio("/notify.mp3"));
  const prevMessagesLength = useRef(0);

  // veritabanındaki mesajları al
  useEffect(() => {
    // mesajlar koleksiyonun referansını al
    const collectionRef = collection(db, "messages");

    // sorgu ayalarını yap
    const q = query(collectionRef, where("room", "==", room), orderBy("createdAt", "asc"));

    // messages kolleksiyonuna abone ol (değişiklikleri takip eder)
    // kolleksiyon her değiştiğinde güncel dökümanları getirir
    const unsub = onSnapshot(q, (snapshot) => {
      // mesajların geçici olarak tutulduğu dizi
      const temp = [];

      // her bir belgenin içindeki dataya erşip diziye aktar
      snapshot.docs.forEach((doc) => {
        temp.push(doc.data());
      });

      // mesaj verilerini state'e aktar
      setMessages(temp);

      // kullanıcı sayfadan ayrılınca abonelik durur
      return () => unsub();
    });
  }, []);

  // her yeni mesaj geldiğin çalışıcak fonksiyon
  useEffect(() => {
    if (messages.length > 1) {
      // gönderilen son mesaja eriş
      const lastMsg = messages.at(-1);

      // kullanıcı yukardıdayken yeni mesaj gelirse
      if (messages.length > prevMessagesLength.current && !isAtBottom) {
        // atılan son mesajı farklı kullanıcı attıysa unread state'ini arttır
        if (lastMsg.author.id !== auth.currentUser.uid) {
          setUnreadCount((prev) => prev + 1);
        }
      }

      // toplam mesaj saysını referansa aktar
      prevMessagesLength.current = messages.length;

      // mesaj geldiğinde son mesaja odaklan ve bildirimi oynat
      if (lastMsg.author.id === auth.currentUser.uid) {
        // eğer son mesajı aktif kullanıcı attıysa her koşulda kaydır
        scrollToBottom();
      } else if (isAtBottom) {
        // son mesajı başka biri attıysa ve en aşağıdaysa kaydır ve bildirim at
        scrollToBottom();
        playSound();
      }
    }
  }, [messages]);

  // aşağıya kaydır
  const scrollToBottom = () => {
    // son mesaja kaydır
    lastMessageRef.current.scrollIntoView();
    // okunmamış mesaj sayısını sıfırla
    setUnreadCount(0);
  };

  // kaydırma anında çalışır
  const handleScroll = (e) => {
    // clientHeight: container'ın kullanıcnın ekranındaki yüksekliği
    // scrollTop: kullanıcı yukarıdan itibaren kaç px kaydırdı
    // scrollHeight: tüm içeriğin yüksekliği (gizli kısımlar dahil)
    const { scrollTop, clientHeight, scrollHeight } = e.target;

    // kullanıcı sayfanın en alttaki 150px'lik kısmında mı?
    setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 150);
  };

  // bildirim sesini oynat
  const playSound = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };

  return (
    <main onScroll={handleScroll} className="flex-1 p-3 flex flex-col gap-3 w-full overflow-y-auto relative">
      {messages.length < 1 ? (
        <div className="h-full grid place-items-center text-zinc-400">
          <p>Sohbete ilk mesajı gönderin</p>
        </div>
      ) : (
        messages.map((i, key) => <Message item={i} key={key} />)
      )}

      <div ref={lastMessageRef} />

      <Arrow isAtBottom={isAtBottom} scrollToBottom={scrollToBottom} unreadCount={unreadCount} />
    </main>
  );
};

export default List;
