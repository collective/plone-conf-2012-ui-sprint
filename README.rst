Goals of Sprint
===============

1)  Provide "click dummies" or clickable mockups of future plone UI
    that'll be used for user testing. Ideally, we can start hasing out
    the best possible UI for the various complicated UI parts plone is
    adding.

2)  Improve various bits of Plone's existing UI failings.


Tasks
=====

Click dummies
-------------

- Toolbar
    - best ways to separate global from context actions
    - cmsui is a pretty good starting place for this
- Unified editing experience
    - How can we mix deco with editing regular plone content
- Toolbar styles
    - perhaps we shouldn't use the black toolbar since it's popular
      to use black toolbars is themes already
- Toolbar placement?
    - should we try and get evidence that putting the toolbar up top is best?
    - Keeping toolbar on top might be an implementation requirement...


UI Guidelines
-------------

Start writing a UI guidelines document. Use UCLA doc as a base.

Make sure to include guidelines on overlays.


Reference Browser Widget Unification
------------------------------------

Use one awesome reference browser widget for all content selection.

Start with archetypes.referencebrowserwidget and make that better after we
have it all integrated

- Use it for plone.app.collection too.
- What about plone.formwidget.contenttree?


Content Rules Mockup
--------------------

Integrate content rules mockup. https://dev.plone.org/ticket/13152

I can give access to the original balsamiq mockup if anyone wants to modify.
Otherwise, it's a pretty decent place to start.


In and out widget
-----------------

Please someone, just fix this with something decent.


Misc
----

I have plenty of other tasks we can do if we have the people.


About this repo
===============

- provides information on sprint
- will house all created click dummies and base click dummies to work with
