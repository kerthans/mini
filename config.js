var host = "https://mini.makershub.top/api/v1/"
var config = {
  host,
  login_url: host + "users/wx-login",
  profile_url: host + "users/profile",
  apply_3d: host + "print/apply",
  history_3d: host + "print/history",
  activity_submit: host + "events/post",
  activity_list: host + "events/view",
  activity_detail: (event_id) => `${host}events/detail/${event_id}`,

}
module.exports = config;