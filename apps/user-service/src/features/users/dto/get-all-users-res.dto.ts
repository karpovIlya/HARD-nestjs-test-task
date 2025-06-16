import { IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { PaginationResDto } from '@app/helpers'

import { GetUserResDto } from './get-user-res.dto'

export class GetAllUsersResDto {
  @IsArray()
  @Type(() => GetUserResDto)
  @ValidateNested({ each: true })
  @ApiProperty({ type: [GetUserResDto] })
  users: GetUserResDto[]

  @ValidateNested()
  @Type(() => PaginationResDto)
  @ApiProperty({ type: PaginationResDto })
  pagination: PaginationResDto
}
