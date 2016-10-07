/**
 * methods.js: REST controller for /api/hello
 */
import {
  getGreeting
} from '../../utils/str'

export function get(req, res) {
  var name = req.query.name || req.params.name
  var lang = req.query.lang || req.params.lang

  if (lang && !name) {
    name = "stranger"
  }

  res.json({
    message: getGreeting(name, lang)
  })
}
