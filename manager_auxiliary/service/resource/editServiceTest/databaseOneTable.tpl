<table  class="table table-striped table-bordered table-hover">
<!--$for (var i=0;i<data.length;i++){-->
	<!--$if (i == 0){-->
    <thead>
    <tr>
        <!--$for (var n in data[i]){-->
                 <th>${n}</th>
        <!--$}-->
    </tr>
    </thead>
    <!--$}-->
    <tbody>
    <tr>
    <!--$for (var n in data[i]){-->
              <td class="hidden-480">
              <textarea>
                   ${data[i][n]}
              </textarea>
              </td>
    <!--$}-->
    </tr>
    </tbody>
<!--$}-->
</table>