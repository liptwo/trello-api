import getColors from 'get-image-colors'

async function pickDominantColor(imgUrl) {
  // console.log('pickDominantColor: ', imgUrl)
  if (!imgUrl) return '#e0e4ea'
  try {
    const colors = await getColors(imgUrl)
    // console.log('colors: ', colors)

    // colors[0] là màu dominant, có thể dùng .hex() hoặc .rgb()
    return colors[0].hex().toString()
  } catch (err) {
    return '#e0e4ea'
  }
}

export default pickDominantColor
