import { Group } from '../../domain/Group';
import { GroupMemberDto } from './GroupMemberDto';

export class GroupDto {
  private constructor(
    public readonly id: string,
    public readonly members: GroupMemberDto[],
  ) {}

  public static from(group: Group): GroupDto {
    return new GroupDto(group.id.value, group.members.map(GroupMemberDto.from));
  }
}
