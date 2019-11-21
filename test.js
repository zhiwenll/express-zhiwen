const bcryptjs = require('bcryptjs')

const str = '123'

async function main(){
    // const hash = await bcryptjs.hash(str, 12)   //设置密码加密强度
    // console.log(hash)
    const isOk = await bcryptjs.compare(
        '123',
        "$2a$12$Xd1QxCo17jpw/vKUgZsSAeGmzfh6Qyuq4N58Gb1TNbr13Zy8aFaL2"
    )
        console.log(isOk)
}

main()

// $2a$12$k.CL18eZta5wgy.c8L6SI.xn4HTOKVL/S0dmXv.axRSjHJksXy1hu
// $2a$12$Xd1QxCo17jpw/vKUgZsSAeGmzfh6Qyuq4N58Gb1TNbr13Zy8aFaL2