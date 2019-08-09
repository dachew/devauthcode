
// Application constants - change these per your local setup
const config = {
	'serviceRoot': 'http://devauth.daptiv.com',
	'redirectUri': 'http://test/',
	'client': {
		'id':'idsrvauthcode-jwt',
		'secret': 'password',
		'scopes': [ 'openid', 'offline_access', 'ppm' ]
	}
}

$(document).ready(() => {
	if (!getValFromUrl('code')) {
		// starting out - invoke the authorize endpoint and start the login process
		$('#initiate-auth').show()
		$('#authorize').attr('href', getLinkToAuthorize())
	}
	else {
		$('#display-auth').show()
		// change the code for a token!
		const code = getValFromUrl('code')
		const state = getValFromUrl('state')
		if (code) {
			$('#code').text(code)
			$('#stateVal').text(state)
			exchangeCodeForToken(code, state)
		} else {
			$('#code').text(`Could not find code parameter in URL`)
		}
	}
})

getLinkToAuthorize = () => {
	const state = generateRandomValue()
	$.cookie('state', state)

	const options = {
		url: `${config.serviceRoot}/connect/authorize`,
		data: {
			'client_id': config.client.id,
			'response_type': 'code',
			'scope': config.client.scopes.join(' '),
			'state': state,
			'redirect_uri': config.redirectUri
		}
	}
	const uri = `${options.url}?${projectObjetToQuerystring(options.data)}`
	console.log(`getting authorize endpoint info: ${JSON.stringify(options, null, 2)}`)
	console.log(`uri: ${uri}`)
	return uri
}

projectObjetToQuerystring = (obj) => {
	return Object.keys(obj).map(key => {
		return `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`
	})
	.join('&')
}

// Gets the authorization code from the URL
getValFromUrl = (key) => {
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has(key)) {
    	return searchParams.get(key)
	}
}

// Exchanges the authorization code for a token
exchangeCodeForToken = (code, state) => {
	const orig_state = $.cookie('state')
	if (state !== orig_state) {
		$('#token-err').text(`Failure: State does not match!  Original state: "${orig_state}" does not equal returned state: "${state}"`)
		return
	}
	$.removeCookie('state')
	console.log(`Exchanging ${code} for a token`)
	const options = {
		url: `${config.serviceRoot}/connect/token`,
		data: {
			'client_id': config.client.id,
			'client_secret': config.client.secret,
			'grant_type': 'authorization_code',
			'code': code,
			'redirect_uri': config.redirectUri
		}
	}
	console.log(`Exchange options: ${JSON.stringify(options, null, 2)}`)
	$.post(options, (data) => {
		$('#token').html(JSON.stringify(data, null, 2))
		if (data.id_token) {
			const match = data.id_token.match(/\.(.*?)\./)[1]
			const token = JSON.parse(atob(match))
			$('#id-token').text(`ID Token: ${JSON.stringify(token, null, 2)}`)
		}
	})
	.fail(err => {
		$('#token-err').text(`Failure: ${JSON.stringify(err, null, 2)}`)
	})
}

generateRandomValue = () => {
	return Math.random().toString(36).substring(2, 15)+Math.random().toString(36).substring(2, 15)
}
