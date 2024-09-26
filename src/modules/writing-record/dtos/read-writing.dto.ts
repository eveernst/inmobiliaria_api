import { Expose } from "class-transformer";

export class ReadWritingDto {
    @Expose()
    writingNumber: number;

    @Expose()
    voteNumberJDAAC: number;

    @Expose()
    voteDateJDAAC: Date;

    @Expose()
    imageJDAAC: string;

    @Expose()
    voteNumberJDUA: number;

    @Expose()
    voteDateJDUA: Date;

    @Expose()
    imageJDUA: string;

    @Expose()
    domain: string;

    @Expose()
    folio: string;
    
    @Expose()
    tomo: string;

    @Expose()
    year: number;

    @Expose()
    department: string;

    @Expose()
    totalSurface: number;

    @Expose()
    coveredSurface: number;

    @Expose()
    improvementSurface: number;

    @Expose()
    improvementValue: number;

    @Expose()
    cadastralNomenclature: string;

    @Expose()
    ubicationMap: string;

    @Expose()
    cadastralInform: string;

    @Expose()
    actingNotary: string;

    @Expose()
    notaryContact: number;

    @Expose()
    interiorImage: string;

    @Expose()
    exteriorImage: string;

    @Expose()
    formalities: string;

    @Expose()
    documentation: string;

    @Expose()
    detailSpaces: string;
}