<ul class="nav ace-nav">
             <!--$for (var i=0;i<data.length;i++){-->
             	        <li class="grey">
							<a href="#" style="padding: 0px;background-color: #438eb9;" title="${data[i].name}" onclick="FireEvent.goTools(${i})">
								<img src="${data[i].icon}" width="56" height="45"></img>
							</a>
						</li>
             <!--$}-->
						

						

						<li class="light-blue">
							<a data-toggle="dropdown" href="#" class="dropdown-toggle">
								<img class="nav-user-photo" src="assets/avatars/user.jpg" alt="Jason's Photo">
								<span class="user-info">
									<small>Welcome,</small>
									Jason
								</span>

								<i class="icon-caret-down"></i>
							</a>

							<ul class="user-menu pull-right dropdown-menu dropdown-yellow dropdown-caret dropdown-close">
								<li>
									<a href="#">
										<i class="icon-cog"></i>
										Settings
									</a>
								</li>

								<li>
									<a href="#">
										<i class="icon-user"></i>
										Profile
									</a>
								</li>

								<li class="divider"></li>

								<li>
									<a href="#">
										<i class="icon-off"></i>
										Logout
									</a>
								</li>
							</ul>
						</li>
</ul><!-- /.ace-nav -->