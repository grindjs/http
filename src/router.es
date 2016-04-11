export class Router {
	_scopedAction = null
	_scopedPrefix = ''
	app = null

	constructor(app) {
		this.app = app
	}

	group(action, callback) {
		this._scopedAction = Object.assign({ }, action)

		if(this._scopedAction.prefix) {
			this._scopedPrefix = this._scopedAction.prefix
			delete this._scopedAction.prefix
		} else {
			this._scopedPrefix = ''
		}

		callback()

		this._scopedAction = null
		this._scopedPrefix = ''
	}

	all(all, action) {
		console.log('Don’t use `all` routes. Offender: %s', path)
		return this.app.all(this._scopedPrefix + path, this._makeAction(action))
	}

	get(path, action, extra) {
		return this._add('get', path, action, extra)
	}

	post(path, action, extra) {
		return this._add('post', path, action, extra)
	}

	put(path, action, extra) {
		return this._add('put', path, action, extra)
	}

	delete(path, action, extra) {
		return this._add('delete', path, action, extra)
	}

	_add(method, path, action, extra) {
		action = this._makeAction(action)

		// WARNING: Prone to failure if ExpressJS changes this logic
		this.app.lazyrouter()

		var route = this.app._router.route(this._scopedPrefix + path)
		route = route[method].apply(route, [ action ])
		route.extra = extra || {}

		return route
	}

	_makeAction(action) {
		if(typeof action === 'function') {
			return action
		}

		if(typeof action === 'string') {
			action = { method: action }
		}

		action = Object.assign({ }, this._scopedAction, action)
		const method = action.controller[action.method]
		const controller = action.controller

		return function() {
			return method.apply(controller, arguments)
		}
	}

}