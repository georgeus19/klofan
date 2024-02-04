workspace {

    model {
        softwareSystem = softwareSystem "Software System" "My software system." {


            catalogUIContainer = container "Catalog UI" "Application for storing data to catalog and viewing them."

            catalogContainer = container "Catalog" "Server for storing RDF data."
            fsStoreContainer = container "RDF FS Store" "Stores uploaded rdf files." "FileSystem"
            uploadRecordsStore = container "Upload Records Store" "Stores records about the uploaded rdf files." "MongoDB"

            analyzersContainer = container "Analyzers" "Analyzes RDF data uploaded and stores metadata/index about them."

            analyzerMetadataStoreContainer = container "Analyzer (Meta)Data Store" "Store any inferred data structures from catalog." "MongoDB"

            recommendersContainer = container "Recommenders" "Provides recommendations for users data in editor."
            
            editorContainer = container "Editor" "Editor application which helps use transform their data to RDF with suitable vocabularies."

        }

        catalogUIContainer -> catalogContainer "Upload RDF and view uploads"

        catalogContainer -> fsStoreContainer "Store uploaded files"
        catalogContainer -> uploadRecordsStore "Store upload records"
        catalogContainer -> analyzersContainer "Forward uploaded rdf files"

        analyzersContainer -> analyzerMetadataStoreContainer "Store analyzed (meta)data"

        recommendersContainer -> analyzersContainer "Get data for recommendations"

        editorContainer -> recommendersContainer "Get recommendations"
    }

    views {

        container softwareSystem "SystemContainerView" {
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