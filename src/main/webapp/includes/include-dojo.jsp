<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<script type="text/javascript">
	dojoConfig = {
		async: true,
		parseOnLoad: true,
		baseUrl: "${pageContext.request.contextPath}" + "/scripts/dojokit/dojo",
		packages:[
			{name: "pacdojo", location: "<c:url value='/scripts/dojokit/dojo'/>"},
			{name: "dataexplore", location: "<c:url value='/pac/dataexplore/js/dataexplore'/>"},
			{name: "datautil", location: "<c:url value='/pac/dataexplore/js/util'/>"},
			{name: "paccommon", location: "<c:url value='/pac/js'/>"}
		]
	};
</script>
<!-- <script type="text/javascript" src="<c:url value='/scripts/dojokit/dojo/dojo.js'/>"></scaript>-->
<script type="text/javascript" src="<c:url value='/scripts/dojokit/dojo/mydojo.gzjs'/>"></script>

