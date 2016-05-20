package com.platform.gui.dataexplore.action;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.struts2.interceptor.ServletRequestAware;
import org.apache.struts2.interceptor.ServletResponseAware;
import org.apache.struts2.util.ServletContextAware;

import com.opensymphony.xwork2.ActionSupport;

public class AbstractActionSupport extends ActionSupport implements ServletRequestAware , ServletResponseAware , ServletContextAware{

	private static final long serialVersionUID = 1L;
	
	protected HttpServletRequest servletRequest;
	
	protected HttpServletResponse servletResponse;
	
	protected ServletContext servletContext;
		
	protected HttpSession session;
		
	public String getContextPath(){
		return this.servletRequest.getContextPath();
	}
	
	public HttpSession getSession() {
		return session;
	}

	public void setSession(HttpSession session) {
		this.session = session;
	}

	public HttpServletRequest getServletRequest() {
		return servletRequest;
	}

	public HttpServletResponse getServletResponse() {
		return servletResponse;
	}

	public ServletContext getServletContext() {
		return servletContext;
	}

	public void setServletContext(ServletContext servletContext) {
		this.servletContext = servletContext;
	}

	public void setServletResponse(HttpServletResponse servletResponse) {
		this.servletResponse = servletResponse;
	}

	public void setServletRequest(HttpServletRequest servletRequest) {
		this.servletRequest = servletRequest;
		this.session = this.servletRequest.getSession();
	}
}
