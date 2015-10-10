
<%
	if (session.getAttribute("login") == null){
		String[] urlArr = request.getRequestURI().split("/");
		String url = urlArr[urlArr.length -1];
		String qStr = request.getQueryString();
		if (qStr != null){
			url = "./" + url + "?" + qStr;
		}
		session.setAttribute("backurl",url);
		
	   response.sendRedirect("index.jsp");
	   return;
   }
%>