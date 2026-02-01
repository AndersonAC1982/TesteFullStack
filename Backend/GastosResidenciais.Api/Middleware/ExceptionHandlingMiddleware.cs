using System.Net;
using System.Text.Json;

namespace GastosResidenciais.Api.Middleware
{
    // Middleware responsável por capturar erros inesperados e retornar uma resposta padronizada para o cliente
    // A intenção é evitar que falhas internas sejam propagadas sem controle para a interface
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro não tratado durante o processamento da requisição.");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            // A resposta inclui uma mensagem amigável e um campo de detalhe para facilitar o diagnóstico
            // Em produção é comum esconder os detalhes da exceção e mantêlos apenas nos logs
            var response = new
            {
                StatusCode = context.Response.StatusCode,
                Message = "Erro interno no servidor. Tente novamente em alguns instantes.",
                Detailed = exception.Message
            };

            var payload = JsonSerializer.Serialize(response);
            return context.Response.WriteAsync(payload);
        }
    }
}
