workspace {

    model {
        softwareSystem = softwareSystem "Klofan" "Klofan software system." {

            catalogUIContainer = container "Catalog UI" "Application for storing data to catalog and viewing them."

            catalogContainer = container "Catalog" "Server for storing RDF data."
            catalogStore = container "Catalog Store" "Stores catalog - dcat datasets (metadata) and analyses metadata" "Virtuoso"

            analyzerManagerContainer = container "Analyzer Manager" "Manages analyzers and saves their analyses and their metadata."
            dcatDatasetQueue = container "Dcat Queue" "Stores dcats submitted for analyses." "Redis"
            group Analyzers {
                analyzerContainer = container "Analyzer" "Analyses dcat datasets."
            }

            adapterContainer = container "Adapter" "Store analyses and Provide access to analyses."
            analysesStoreContainer = container "Analyses Store" "Stores analyses." "MongoDB"
 
            recommenderManagerContainer = container "Recommender Manager" "Manage recommenders for recommending in editor."
            group Recommenders {
                recommenderContainer = container "Recommender" "Recommends transformations for editor."
            }

            editorContainer = container "Editor" "Editor application which helps use transform their data to RDF with suitable vocabularies."
        }

        catalogUIContainer -> catalogContainer "Upload dcat datasets"
        catalogContainer -> catalogStore "Stores dcat datasets"
        catalogContainer -> analyzerManagerContainer "Sends dcat datasets"

        analyzerManagerContainer -> analyzerContainer "Sends dcat datasets for analysis"
        analyzerManagerContainer -> dcatDatasetQueue "Push and pop dcat datasets"
        analyzerManagerContainer -> adapterContainer "Saves analyses"
        analyzerManagerContainer -> catalogContainer "Saves dcat analyses metadata"
        adapterContainer -> analysesStoreContainer "Stores analyses"

        editorContainer -> recommenderManagerContainer "Gets recommendations"
        recommenderManagerContainer -> recommenderContainer "Gets recommendations"
        recommenderContainer -> adapterContainer "Gets analyses"
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