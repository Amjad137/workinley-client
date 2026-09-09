export interface IPresignedUrlResponse {
  key: string;
  presignedUrl: string;
}

export interface IPublicUploadResponse extends IPresignedUrlResponse {
  publicUrl: string;
}

export interface IUploadSecureFileResponse {
  key: string;
}

export interface IUploadPublicImageResponse {
  key: string;
  url: string;
}

export interface IUploadMultipleImagesResponse {
  uploads: {
    key: string;
    url: string;
  }[];
}
