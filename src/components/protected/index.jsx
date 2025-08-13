import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { auth } from "../../firebase";
import Loader from "../loader/index";

const Protected = () => {
  // aktif kullanıcı (oturum açık olan) state'i
  const [user, setUser] = useState(undefined);

  // aktif kullanıcı (oturum açık olan) verisini al
  useEffect(() => {
    // onAuthStateChanged: giriş ve çıkış durumlarında kullanıcı verisini getir
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);

  // kullanıcı verisi yükleniyorsa ekrana loader bas
  if (user === undefined) return <Loader />;

  // kullanıcının oturumu kapalıysa: login sayfasına yönlendir
  // Navigate: render sırasında yönlendirme yapılıcaksa kullanılır
  // replace: yönlendirmeden önce bulunduğu sayfayı geçmişten sil
  if (user === null) return <Navigate to="/" replace />;

  // kullanıcının oturumu açıksa: sayfayı göster
  // Outlet: kapsayıcı içerisinde alt route'un elementini ekrana bass
  return <Outlet context={user} />;
};

export default Protected;
