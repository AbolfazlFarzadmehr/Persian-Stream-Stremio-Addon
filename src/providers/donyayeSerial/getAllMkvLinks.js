export default async function getAllMkvLinks(info, outSideOfIran = false) {
  try {
    // const mkvLinks = await (outSideOfIran
    //   ? this.getStreamsFromAbroad(info)
    //   : this.getStreamFromIranAccess(info));
    const mkvLinks = await this.getStreamFromIran(info);
    if (mkvLinks.err) throw new Error(mkvLinks.err.message);
    return { mkvLinks, provider: this.name };
  } catch (err) {
    console.error(`Failed to get mkvLinks from Donyaye seryal: ${err.message}`);
    return { mkvLinks: [], provider: this.name, err };
  }
}
