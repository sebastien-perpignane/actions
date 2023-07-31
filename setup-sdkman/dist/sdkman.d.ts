export declare const SDKMAN_DIR: string;
export interface Candidate {
    name: string;
}
export declare class SdkMan {
    private installDir;
    constructor(installDir?: string);
    installSdkMan(): Promise<number>;
    private getBashSdkmanInstallationScript;
    private runSdkmanInstallScript;
    configureSdkManForAutoAnswer(): void;
    uninstall(candidate: string, version: string, force?: boolean): Promise<void>;
    installCandidateAndAddToPath(candidate: Candidate, version: string): Promise<void>;
    private candidateDir;
    private candidateCurrentDir;
    private candidateVersionDir;
    isInstalled(): boolean;
    isCandidateInstalled(candidate: Candidate): boolean;
    isCandidateVersionInstalled(candidate: Candidate, version: string): boolean;
    private runCommand;
    candidatesDir(): string;
}
