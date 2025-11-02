<!DOCTYPE html>
<html>

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>redirect</title>
	<script>
		const redirectUrl = {!! json_encode($share_url ?? "",JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT) !!};
		window.location.replace(
			redirectUrl
		);
	</script>
</head>

<body>
</body>

</html>