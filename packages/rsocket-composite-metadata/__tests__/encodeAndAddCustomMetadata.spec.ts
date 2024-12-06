import { encodeAndAddCustomMetadata } from "@sjerman/rsocket-composite-metadata";
import { hex } from "./test-utils/hex.js";
import bufferPkg from "buffer";

describe("encodeAndAddCustomMetadata", () => {
  it("throws if custom mimtype length is less than 1", () => {
    expect(() =>
      encodeAndAddCustomMetadata(
        bufferPkg.Buffer.from([]),
        "",
        bufferPkg.Buffer.from("1234")
      )
    ).toThrow(
      "Custom mime type must have a strictly positive length that fits on 7 unsigned bits, ie 1-128"
    );
  });

  it("throws if custom mimtype length is greater than 127", () => {
    let mime = "";
    while (mime.length < 130) {
      mime += "a";
    }
    expect(() =>
      encodeAndAddCustomMetadata(
        Buffer.from([]),
        mime,
        bufferPkg.Buffer.from("1234")
      )
    ).toThrow(
      "Custom mime type must have a strictly positive length that fits on 7 unsigned bits, ie 1-128"
    );
  });

  it("encodes the header and payload as per spec", () => {
    const { c, u, s, t, o, m } = hex;
    const metadata = encodeAndAddCustomMetadata(
      bufferPkg.Buffer.from([]),
      "custom",
      bufferPkg.Buffer.from("1234")
    );
    const expectedHeaderLength8 = "05";
    const expectedPayloadLength24 = "000004";
    const expectedHeader = `${expectedHeaderLength8}${c}${u}${s}${t}${o}${m}${expectedPayloadLength24}`;
    const expectedPayload = `${hex["1"]}${hex["2"]}${hex["3"]}${hex["4"]}`;
    expect(metadata.toString("hex")).toBe(
      `${expectedHeader}${expectedPayload}`
    );
  });
});
