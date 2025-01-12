import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

// import { CreateUserDto, LoginUserDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({})
  async signup(
    @Body() body: { name: string; email: string; password: string },
  ) {
    return this.usersService.signup(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({ status: 200, description: 'Login successful.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async login(@Body() LoginUserDto: LoginUserDto) {
    return this.usersService.login(LoginUserDto);
  }
}
