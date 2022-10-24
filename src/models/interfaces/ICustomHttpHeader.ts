import { IncomingHttpHeaders } from "http";

export interface ICustomHttpHeader extends IncomingHttpHeaders {
    x_client_type: string;
    x_client_name: string;
    x_client_version: string;
    x_client_id?: string;
}