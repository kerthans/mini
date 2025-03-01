var host = "https://mini.makershub.top/api/v1/"
var config = {
  host,
  login_url: host + "users/wx-login",
  profile_url: host + "users/profile",
  apply_3d: host + "print/apply",
  history_3d: host + "print/history"

}
module.exports = config;