// interface: 회원가입 request body dto //
export default interface SignUpRequestDto {
    name: string;
    userId: string;
    password: string;
    telNumber: string;
    authNumber: string;
    joinPath: string;
    snsId?: string;
}