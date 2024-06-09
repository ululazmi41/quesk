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
}

const appLocalStorage = new AppLocalStorage()
export { appLocalStorage }
