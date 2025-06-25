export class AppError extends Error
{
    // -- CONSTRUCTOR

    constructor(
        message,
        statusCode = 400
        )
    {
        super( message );
        this.statusCode = statusCode;
    }
}
