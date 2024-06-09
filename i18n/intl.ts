const lib = {
  "id": {
    nav: {
      profile: "Profil",
      logout: "Keluar",
    },
    home: {
      myTask: "Tugas",
      search: "cari",
      create: "Baru",
      addATask: "buat tugas",
      completed: "Telah selesai",
    },
    tasks: {
      title: "Judul",
      description: "Deskripsi",
      submit: "Simpan",
      update: "Simpan",
      completed: "Telah selesai",
    },
    profile: {
      changePassword: "ganti password",
      edit: "ubah",
      old: "Lama",
      new: "Baru",
      confirm: "Konfirmasi",
      emailTaken: "Email dipakai",
      emailInvalid: "Email tidak valid",
      usernameTaken: "Username dipakai",
      cancel: "Kembali",
      submit: "Ubah",
    },
  },
  "en": {
    nav: {
      profile: "Profile",
      logout: "Logout",
    },
    home: {
      myTask: "My Task",
      search: "search",
      create: "Create",
      addATask: "add a task",
      completed: "Completed",
    },
    tasks: {
      title: "Title",
      description: "Description",
      submit: "Submit",
      update: "Update",
      completed: "Completed",
    },
    profile: {
      changePassword: "Change Password",
      edit: "Edit",
      old: "Old",
      new: "New",
      confirm: "Confirm",
      emailTaken: "Email taken",
      emailInvalid: "Email invalid",
      usernameTaken: "Username taken",
      cancel: "Cancel",
      submit: "Submit",
    },
  },
}

class Intl {
  private locale: string = "en"
  lib: any = {}
  constructor(locale: string) {
    if (locale === "id") {
      this.locale = "id"
    }
    this.initLib()
  }

  changeLocale(locale: string) {
    this.locale = locale
    this.initLib()
  }

  initLib() {
    this.lib = lib[this.locale as keyof typeof lib]
  }
}

const intl = new Intl("en")
export { intl }
