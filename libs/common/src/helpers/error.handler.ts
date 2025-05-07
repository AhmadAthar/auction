import { BadRequestException, ConflictException, ForbiddenException, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";

export function handleError(error: any) {
    console.log("error: ", error)
    switch (error) {

        case error instanceof NotFoundException:
            throw new NotFoundException(error.message);

        case error instanceof BadRequestException:
            throw new BadRequestException(error.message);

        case error instanceof ForbiddenException:
            throw new ForbiddenException(error.message);

        case error instanceof ConflictException:
            throw new ConflictException(error.message);

        case error instanceof UnauthorizedException:
            throw new UnauthorizedException(error.message);

        default:
            throw new InternalServerErrorException(error.message)
    }
}