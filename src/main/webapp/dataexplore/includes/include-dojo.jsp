<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<script type="text/javascript">
	dojoConfig = {
		async: true,
		parseOnLoad: true,
		baseUrl: "${pageContext.request.contextPath}" + "/scripts/dojokit/dojo",
		packages:[
			{name: "dataexplore", location: "<c:url value='/dataexplore/js/dataexplore'/>"},
			{name: "datautil", location: "<c:url value='/dataexplore/js/util'/>"},
			{name: "paccommon", location: "<c:url value='/scripts/dojokit/dojo'/>"}
		]
	};
</script>
<script type="text/javascript" src="<c:url value='/scripts/dojokit/dojo/dojo.js'/>"></scaript>

