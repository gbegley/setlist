<%@ page contentType="text/html;charset=UTF-8" language="java" session="true" %>

<html>
<head>
    <title>Master List</title>
    <%--<link rel="stylesheet" type="text/css" href="http://extjs.cachefly.net/ext-4.1.0-gpl/resources/css/ext-all.css">--%>
    <%--<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/setlist.css">--%>
    <script type="text/javascript">
        var RCP = '${pageContext.request.contextPath}';
    </script>
    <!--<script type="text/javascript" charset="utf-8" src="http://cdn.sencha.io/ext-4.1.0-gpl/ext-all.js"></script>-->
    <%--<script type="text/javascript" charset="utf-8" src="http://cdn.sencha.io/ext-4.1.0-gpl/ext-all-debug.js"></script>--%>
    <%--<script type="text/javascript" src="${pageContext.request.contextPath}/js/setlist/init.js"></script>--%>
    <%--<script type="text/javascript" src="${pageContext.request.contextPath}/js/setlist/App.js"></script>--%>

    <script type="text/javascript" src="${pageContext.request.contextPath}/js/d3.v2.js"></script>
</head>
<body>
Hi master
</body>
<script>
/*
    d3.select("body").selectAll("p")
            .data([4, 8, 15, 16, 23, 42])
            .enter().append("p")
            .text(function(d) { return "I’m number " + d + "!"; });
*/

    var masterListUrl = "https://docs.google.com/spreadsheet/pub?key=0Ang4R1SSMD9ncEVFR3BwVndPVFVvNlFsWnJLb1UyV0E&output=csv";
    d3.csv(masterListUrl,function(rows){

        console.log('Rows: '+rows);
/*
        d3.select("body").selectAll("p")
                .data([4, 8, 15, 16, 23, 42])
                .enter().append("p")
                .text(function(d) { return "I’m number " + d + "!"; });

*/

    });

</script>
</html>