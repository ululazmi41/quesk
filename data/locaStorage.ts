class AppLocalStorage {
  getDarkmode(): boolean {
    return window.localStorage.getItem('darkmode') === "true" ?? false
  }
  toggleDarkmode() {
    const prev = this.getDarkmode()
    window.localStorage.setItem('darkmode', (!prev).toString())
  }
  resetDarkmode() {
    window.localStorage.removeItem('darkmode')
  }
  getLocale(): string {
    return window.localStorage.getItem('locale') ?? "en"
  }
  changeLocale(locale: string) {
    window.localStorage.setItem('locale', locale)
  }
}

const appLocalStorage = new AppLocalStorage()
export { appLocalStorage }
