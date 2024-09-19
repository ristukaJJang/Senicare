import ResponseDto from "../response.dto";

// interface: get sign in response body dto //
export default interface GetSignInResponseDto extends ResponseDto{
    userId: string;
    name: string;
    telNumber: string;
}