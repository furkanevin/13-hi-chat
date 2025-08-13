import { useRef, useState } from "react";
import { db } from "../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import EmojiPicker from "emoji-picker-react";

const Form = ({ room, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const inputRef = useRef();

  const handleEmojiClick = (e) => {
    if (inputRef.current) {
      // inputta imleçle yapılan seçimin başladığı konum
      const start = inputRef.current.selectionStart;

      // inputta imleçle yapılan seçimin bittiği konum
      const end = inputRef.current.selectionEnd;

      // seçili konuma emojiyi ekle
      setText((curr) => curr.substring(0, start) + e.emoji + curr.substring(end));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    // verinin kaydedileceği kolleksiyonun referansını al
    const collectionRef = collection(db, "messages");

    // temizle
    setText("");
    setIsOpen(false);

    // mesaj belgesini kolleksiyona ekle (veritabanına kaydet)
    await addDoc(collectionRef, {
      text,
      room,
      author: {
        id: user.uid,
        name: user.displayName,
        photo: user.photoURL,
      },
      createdAt: serverTimestamp(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 border border-gray-200 shadow-lg flex justify-center gap-3">
      <input
        value={text}
        ref={inputRef}
        onChange={(e) => setText(e.target.value)}
        type="text"
        placeholder="mesaj giriniz..."
        className="border border-gray-200 shadow-sm p-2 px-3 rounded-md w-1/2"
      />

      <div className="relative">
        <div className="absolute top-[-470px] right-[-140px]">
          <EmojiPicker open={isOpen} onEmojiClick={handleEmojiClick} />
        </div>

        <button type="button" className="btn text-base" onClick={() => setIsOpen(!isOpen)}>
          😂
        </button>
      </div>

      <button type="submit" disabled={!text.trim()} className="btn bg-black text-white disabled:brightness-75">
        Gönder
      </button>
    </form>
  );
};

export default Form;
