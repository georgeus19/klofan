workspace {

    model {

        user = person "User" "Wants to transform data to RDF"
        admin = person "Administrator"

        softwareSystem = softwareSystem "Klofan" "My software system." {

            catalogContainer = container "Catalog" "Manages RDF data and provides recommendations to editor." {
                catalogComponent = component "Dataset Manager" "Manages datasets (and their data) and notifies analyzers."
                group Recommenders {
                    recommendersComponent = component "Recommender" "Provides recommendations based on editor data and analyses."
                }
                group Analyzers {
                    analyzersComponent = component "Analyzer" "Performs analysis on dataset data to create analyses."
                }
            }

            rdfStoreContainer = container "RDF Triplestore" "Stores datasets, dataset data and analyses." "Virtuoso"

            editorContainer = container "Editor" "Provides transformation environment to transform structured data to RDF."

        }

        user -> editorContainer "Transform data to RDF"
        admin -> catalogComponent "Upload datasets"

        catalogComponent -> analyzersComponent "Analyze uploaded data"

        catalogComponent -> rdfStoreContainer "Store and fetch datasets, dataset data, analyses"
        analyzersComponent -> rdfStoreContainer "Access uploaded data for analysis"
        recommendersComponent -> rdfStoreContainer "Get analyses for recommendations"

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