import { GroupMember } from '../../domain/GroupMember';

export class GroupMemberDto {
  private constructor(
    public readonly id: string,
    public readonly contestantId: string,
  ) {}

  public static from(member: GroupMember): GroupMemberDto {
    return new GroupMemberDto(member.id.value, member.contestantId.value);
  }
}
