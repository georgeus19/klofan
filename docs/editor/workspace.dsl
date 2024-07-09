workspace {

    model {
        softwareSystem = softwareSystem "Klofan" "My software system." {


            userContainer = container "Editor/Recommender"
            
            frontendContainer = container "Data Representation"{
                parseComponent = component "Parse" "Parses structured data."
                transformComponent = component "Transform" "Provides factories for transformations on schema and instances."
                schemaComponent = component "Schema" "Encapsulates schema logic."
                instancesComponent = component "Instances" "Encapsulates instances logic."
            }
        }

        schemaComponent -> parseComponent "Load from"
        
        instancesComponent -> parseComponent "Load from"
        instancesComponent -> schemaComponent "Access schema"

        transformComponent -> schemaComponent "Access schema"
        transformComponent -> instancesComponent "Access instances"

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