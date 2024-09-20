import { Tool } from "src/types";
import ResponseDto from "../response.dto";

// interface: get tool list response body dto //
export default interface GetToolListResponseDto extends ResponseDto{
    tools: Tool[]
}