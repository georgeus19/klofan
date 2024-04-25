workspace {

    model {
        user = person "User" "Wants to transform data to RDF"
        admin = person "Administrator"
        softwareSystem = softwareSystem "Klofan" "My software system." {

            catalogContainer = container "Catalog" "Manages datasets and notifies analyzers."
            uploadRecordsStore = container "Dataset Triplestore" "Stores datasets (metadata)." "Virtuoso"

            group Analyzers {
                analyzersContainer = container "Analyzer" "Performs analysis on dataset data to create analyses."
            }

            group Recommenders {
                recommendersContainer = container "Recommender" "Provides recommendations based on editor data and analyses."
            }

            group "Analyses Stores" {
                analyzerMetadataStoreContainer = container "Analyses Store" "Stores analyses." "MongoDB"
            }

            editorContainer = container "Editor" "Provides transformation environment to transform structured data to RDF."
        }

        user -> editorContainer "Transform data to RDF"
        admin -> catalogContainer "Upload datasets"

        catalogContainer -> uploadRecordsStore "Store uploaded datasets"
        catalogContainer -> analyzersContainer "Send datasets to analyze"


        analyzersContainer -> analyzerMetadataStoreContainer "Store analyses"
        analyzersContainer -> catalogContainer "Send analysis provenance"

        recommendersContainer -> analyzerMetadataStoreContainer "Get analyses"

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