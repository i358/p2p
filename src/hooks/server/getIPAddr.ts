export default (req:any) => {
    let ip = (req.headers['x-forwarded-for'] || "0,0").split(",")[0] || req.connection.remoteAddress;
    return ip;
}