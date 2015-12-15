<div class="tabbable">
											<ul class="nav nav-tabs" id="myTab">
												<li class="active">
													<a data-toggle="tab" href="#case_home" >
														<i class="green icon-home bigger-110"></i>
														基本信息
													</a>
												</li>

												<li class="">
													<a data-toggle="tab" href="#case_session"  onclick="FireEvent.showCaseMemSession('${data.idx}')">
														内存与session
													</a>
												</li>

												<li class="dropdown">
													<a data-toggle="dropdown" class="dropdown-toggle" href="#">
														数据库设置 &nbsp;
														<i class="icon-caret-down bigger-110 width-auto"></i>
													</a>

													<ul class="dropdown-menu dropdown-info">
														<li class="">
															<a data-toggle="tab" href="#dropdown1">@fat</a>
														</li>

														<li class="">
															<a data-toggle="tab" href="#dropdown2">@mdo</a>
														</li>
													</ul>
												</li>
                                                <li class="dropdown">
													<a data-toggle="dropdown" class="dropdown-toggle" href="#">
														期待结果 &nbsp;
														<i class="icon-caret-down bigger-110 width-auto"></i>
													</a>

													<ul class="dropdown-menu dropdown-info">
														<li class="">
															<a data-toggle="tab" href="#dropdown1">@fat</a>
														</li>

														<li class="">
															<a data-toggle="tab" href="#dropdown2">@mdo</a>
														</li>
													</ul>
												</li>
											</ul>

											<div class="tab-content" >
												<div id="case_home" class="tab-pane active">
                                                    <div id="case_home_show">
													用例名称:<input type="text" value="${data.caseName}"/>
                                                    </div>
												</div>

												<div id="case_session" class="tab-pane">
                                                    <div id="case_session_show" class="container-fluid">
                                                       
                                                    </div>
													
												</div>

												<div id="dropdown1" class="tab-pane">
													<p>Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic lomo retro fanny pack lo-fi farm-to-table readymade.</p>
												</div>

												<div id="dropdown2" class="tab-pane">
													<p>Trust fund seitan letterpress, keytar raw denim keffiyeh etsy art party before they sold out master cleanse gluten-free squid scenester freegan cosby sweater. Fanny pack portland seitan DIY, art party locavore wolf cliche high life echo park Austin.</p>
												</div>
											</div>
										</div>