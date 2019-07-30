
// Application constants - change these per your local setup
const config = {
	'serviceRoot': 'http://devauth.daptiv.com',
	'redirectUri': 'http://devauthcode.daptiv.com/',
	'client': {
		'id':'idsrvauthcode',
		'secret': 'password',
		'scopes': [ 'openid', 'offline_access', 'ppm' ]
	}
}

$(document).ready(() => {
	const state = generateRandomValue()

	let code = getCodeFromUrl(window.location.search)
	if (code) {
		$('#code').text(code)
		exchangeCodeForToken(code)
	} else {
		$('#code').text(`Could not find code parameter in URL`)
	}
})

// Gets the authorization code from the URL
getCodeFromUrl = (search) => {
    let searchParams = new URLSearchParams(search)
    if (searchParams.has('code')) {
    	return searchParams.get('code')
	}
}

// Exchanges the authorization code for a token
exchangeCodeForToken = (code) => {
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
			//console.log(`id token present: ${data.id_token}`)
			const match = data.id_token.match(/\.(.*?)\./)[1]
			//console.log(`match: ${match}`)
			const token = JSON.parse(atob(match))
			console.log(`token: ${JSON.stringify(token, null, 2)}`)
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
