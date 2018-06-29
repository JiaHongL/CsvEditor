export interface Res {
    success: boolean;
    csv?: {
        columns: Array<any>;
        data: Array<any>;
    };
    message?: string
};
