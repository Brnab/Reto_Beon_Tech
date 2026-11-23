function fn() {
  var env = karate.env || 'dev';
  var config = {
    env: env,
    baseUrl: 'https://restful-booker.herokuapp.com'
  };
  karate.configure('connectTimeout', 15000);
  karate.configure('readTimeout', 15000);
  return config;
}
