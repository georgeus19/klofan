workspace {

    model {
        softwareSystem = softwareSystem "Software System" "My software system." {


            catalogUIContainer = container "Catalog UI" "Application for storing data to catalog and viewing them."

            catalogContainer = container "Catalog" "Server for storing RDF data and providing recommendations." {
                catalogComponent = component "Data Uploader" "Uploads RDF data to database along with any analyzed metadata."
                recommendersComponent = component "Recommenders" "Provides recommendations for users data in editor."
                analyzersComponent = component "Analyzers" "Analyzes RDF data uploaded and stores metadata/index about them."
            }

            rdfStoreContainer = container "Uploaded RDF & Metadata Triplestore" "Store original uploaded rdf data and any metadata from analyzers." "Virtuoso"

            editorContainer = container "Editor" "Editor application which helps use transform their data to RDF with suitable vocabularies."

        }

        catalogUIContainer -> catalogComponent "Upload RDF and view uploads"

        catalogComponent -> analyzersComponent "Analyze uploaded data"
        recommendersComponent -> analyzersComponent "Get metadata queries"

        catalogComponent -> rdfStoreContainer "Upload and fetch RDF data and its metadata"
        analyzersComponent -> rdfStoreContainer "Access uploaded data for analysis"
        recommendersComponent -> rdfStoreContainer "Access uploaded data for recommendations"

        editorContainer -> recommendersComponent "Get recommendations"

    }

    views {

        container softwareSystem "SystemContainerView" {
            include *
        }

        component catalogContainer "CatalogComponentView" {
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