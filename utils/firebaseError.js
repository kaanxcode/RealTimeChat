const firebaseErrorMessages = {
  //auth
  "auth/invalid-email": "Geçersiz mail.",
  "auth/user-disabled": "Kullanıcı devre dışı bırakıldı.",
  "auth/user-not-found": "Kullanıcı bulunamadı.",
  "auth/wrong-password": "Yanlış şifre.",
  "auth/email-already-in-use": "Bu mail zaten kullanımda.",
  "auth/operation-not-allowed": "Bu işlem yapılamıyor.",
  "auth/weak-password": "Şifre çok zayıf. En az 6 karakter olmalı.",
  "auth/too-many-requests":
    "Çok fazla istek. Lütfen daha sonra tekrar deneyin.",
  "auth/expired-action-code": "Kod süresi dolmuş.",
  "auth/invalid-action-code": "Geçersiz kod.",
  "auth/invalid-credential": "Geçersiz kimlik bilgileri.",
  // firestore
  unauthenticated: "Kimlik doğrulaması başarısız. Lütfen giriş yapın.",
  "permission-denied": "Erişim izni reddedildi.",
  "not-found": "Belirtilen dosya veya klasör bulunamadı.",
  "quota-exceeded": "Depolama kotası aşıldı.",
  "invalid-argument": "Geçersiz argüman.",
  aborted: "İşlem iptal edildi.",
  internal: "İç hata. Sunucu tarafında beklenmedik bir hata oluştu.",
  "deadline-exceeded": "İşlem süresi aşıldı.",
  "resource-exhausted": "Kaynak tükenmiş.",
  "data-loss": "Veri kaybı. Veriler kayboldu veya bozuldu.",
  "invalid-field": "Geçersiz alan.",
  "already-exists": "Belirli bir dosya veya klasör zaten mevcut.",
  "failed-precondition":
    "İşlem, belirli bir ön koşulun karşılanmaması nedeniyle başarısız oldu.",
  "storage/unknown": "Bilinmeyen hata. Lütfen tekrar deneyin.",
  // storage
  unauthenticated:
    "Kimlik doğrulaması başarısız. Kullanıcının kimlik doğrulaması gerekir.",
  "permission-denied": "Erişim izni reddedildi.",
  "not-found": "Belirtilen dosya veya klasör bulunamadı.",
  "quota-exceeded": "Depolama kotası aşıldı.",
  "invalid-argument": "Geçersiz argüman.",
  aborted: "İşlem iptal edildi.",
  internal: "İç hata. Sunucu tarafında beklenmedik bir hata oluştu.",
  "deadline-exceeded": "İşlem süresi aşıldı.",
  "resource-exhausted": "Kaynak tükenmiş.",
  "data-loss": "Veri kaybı. Veriler kayboldu veya bozuldu.",
  "invalid-field": "Geçersiz alan.",
  "already-exists": "Belirli bir dosya veya klasör zaten mevcut.",
  "failed-precondition":
    "İşlem, belirli bir ön koşulun karşılanmaması nedeniyle başarısız oldu.",
  "storage/unknown":
    "Bilinmeyen hata. Sunucu veya istemci tarafında beklenmedik bir durum oluştu.",
};

export const getErrorMessage = (errorCode) => {
  return (
    firebaseErrorMessages[errorCode] ||
    "Bir hata oluştu. Lütfen tekrar deneyin."
  );
};
