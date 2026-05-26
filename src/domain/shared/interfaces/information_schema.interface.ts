export interface InformationSchemaColumnName {
    columnName: string;
}

export interface InformationSchemaTableName {
    tableName: string;
}

export interface InformationSchemaColumnData {
    columnName: string;
    isNullable: boolean;
    dataType: string;
    attnum: number;
}