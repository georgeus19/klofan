workspace {

    model {
        user = person "User" "A user of my software system."
        softwareSystem = softwareSystem "Software System" "My software system." {

            frontendContainer = container "Frontend" "Frontend" {
                uiComponent = component "UI" "User Interface"
                parseComponent = component "Parse" "Parses files to schema and instances"
                transformComponent = component "Transform" "Provides transformation option"
                schemaComponent = component "Schema" "Any schema manipulation"
                instancesComponent = component "Instances" "Any schema instance manipulation"
            }
        }


        uiComponent -> parseComponent "Parse input files"
        uiComponent -> schemaComponent "Query and transform schema"
        uiComponent -> instancesComponent "Query and transform schema instances"
        uiComponent -> transformComponent "Create transformations"

        parseComponent -> schemaComponent "Load schema"
        parseComponent -> instancesComponent "Load instances"
        transformComponent -> schemaComponent "Access schema"
        transformComponent -> instancesComponent "Access instances"


        user -> softwareSystem "Uses"
    }

    views {

        container softwareSystem "SystemContainerView" {
            include *
        }

        component frontendContainer "FrontendComponentView" {
            include *
        }

        

     styles {
        element "Element" {
            fontSize 32
        }

        relationship "Relationship" {
            fontSize 30
        }

        element "Group" {
            fontSize 30
        }

           element "Existing System" {
                background #999999
            }

    }

        

    theme default

    }
    
}