        public async static Task UltraLogin()
        {
            try
            {
                ServerSocket.getCaptcha();
                string captchaResponse = await ServerSocket.captchaService();
                if (captchaResponse != null)
                {
                    var proxyAddress = "http://es-pr.oxylabs.io:10002";
                    var proxyUsername = "customer-user";
                    var proxyPassword = "pass";

                    var proxy = new WebProxy(proxyAddress)
                    {
                        Credentials = new NetworkCredential(proxyUsername, proxyPassword)
                    };

                    var options = new RestClientOptions("https://www.habbo.es")
                    {
                        Proxy = proxy
                    };

                    var client = new RestClient(options);

                    var request = new RestRequest("api/public/authentication/login", Method.Post);

                    string hCaptchaToken = captchaResponse.Split("#")[0];
                    string userAgent = captchaResponse.Split("#")[1];
                    string host = captchaResponse.Split("#")[2];

                    Core.c("UserAgent: " + userAgent);
                    Core.c("Host: " + host);


                    string auth = "{\"captchaToken\":\"" + hCaptchaToken + "\",\"email\":\"" + "ejemplo@gmail.com" + "\",\"password\":\"" + "clave123" + "\"}";
                    request.AddParameter("application/json", auth, ParameterType.RequestBody);

                    Core.c("UltraLogin > Json Enviado: " + auth.ToString());

                    // Headers
                    request.AddHeader("Accept", "application/json, text/plain, */*");
                    request.AddHeader("Accept-Language", "es-AR,es;q=0.8,en-US;q=0.5,en;q=0.3");
                    request.AddHeader("Accept-Encoding", "gzip, deflate, br");
                    request.AddHeader("User-Agent", userAgent);
                    request.AddHeader("Content-Type", "application/json;charset=utf-8");
                    request.AddHeader("x-habbo-fingerprint", "4ea48151c69332408875a29d549812a9");
                    request.AddHeader("Connection", "keep-alive");
                    request.AddHeader("Host", "www.habbo.es");
                    request.AddHeader("Origin", "https://www.habbo.es");
                    request.AddHeader("Referer", "https://www.habbo.es/");
                    request.AddHeader("Sec-Fetch-Dest", "empty");
                    request.AddHeader("Sec-Fetch-Mode", "cors");
                    request.AddHeader("Sec-Fetch-Site", "same-origin");

                    // Cookies
                    request.AddCookie("browser_token", "s%3ApA9mgu4ly13TmQ5EhSUlEgF3zfCPC7tl87aONnBmEYY.rQ8yHicmbmp3K%2FSWLN%2BQi2nt2wRAlHfKEHQmB1kDR%2BY", "/", "habbo.es");

                    try
                    {
                        var cancellationTokenSource = new CancellationTokenSource();
                        var response = await client.ExecuteAsync(request, cancellationTokenSource.Token);


                        string finalUrl = options.BaseUrl.ToString() + request.Resource;
                        Core.c("URL de la solicitud: " + finalUrl);


                        if (response.IsSuccessful)
                        {
                            string res = response.Content;
                            Core.c("Resultado: " + res, ConsoleColor.Green);
                        }
                        else
                        {
                            Core.c("Error al hacer el login | Response: " + response.StatusCode.ToString(), ConsoleColor.Red);
                            Core.c("Detalles del error: " + response.Content, ConsoleColor.Red);
                        }
                    }
                    catch (Exception ex)
                    {
                        Core.c("Error al hacer el login | " + ex.Message, ConsoleColor.Red);
                    }
                }
                else
                {
                    Core.c("UltraLogin > Error al obtener el captcha", ConsoleColor.Red);
                }
            }
            catch (Exception ex)
            {
                Core.c("UltraLogin > Exception: " + ex.Message, ConsoleColor.Red);
            }
        }