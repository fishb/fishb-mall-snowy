import setupDefaults from './setupDefaults'

import round from './round'
import ceil from './ceil'
import floor from './floor'

import isNumber from './isNumber'
import toValueString from './toValueString'
import toFixed from './toFixed'

import toNumberString from './toNumberString'
import assign from './assign'

/**
  * 千分位分隔符、小数点
  *
  * @param {String/Number} num 数值
  * @param {CommafyOptions} options 参数
  * @return {String}
 */
function commafy(num, options) {
  var opts = assign({}, setupDefaults.commafyOptions, options)
  var optDigits = opts.digits
  var isNum = isNumber(num)
  var rest, result, isNegative, intStr, floatStr
  if (isNum) {
    rest = (opts.ceil ? ceil : (opts.floor ? floor : round))(num, optDigits)
    result = toNumberString(optDigits ? toFixed(rest, optDigits) : rest).split('.')
    intStr = result[0]
    floatStr = result[1]
    isNegative = intStr && rest < 0
    if (isNegative) {
      intStr = intStr.substring(1, intStr.length)
    }
  } else {
    rest = toValueString(num).replace(/,/g, '')
    result = rest ? [rest] : []
    intStr = result[0]
  }
  if (result.length) {
    return (isNegative ? '-' : '') + intStr.replace(new RegExp('(?=(?!(\\b))(.{' + (opts.spaceNumber || 3) + '})+$)', 'g'), (opts.separator || ',')) + (floatStr ? ('.' + floatStr) : '')
  }
  return rest
}

export default commafy
